import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useKimaiStore = defineStore(
  'kimai',
  () => {

    const users = ref([])
    const projects = ref([])
    const activities = ref([])
    const activeRecords = ref([])
    const showDialog = ref(false)
    const dialogTitle = ref("")
    const dialogName = ref("")

    const selectedProject = ref([])
    const selectedActivity = ref([])

    const API_URL = ref('')

    const currentlyRunningRecords = {}
    const userMapping = {}
    const userNameMappings = {}


    const axiosConfig = ref({
      headers: {
        'X-AUTH-USER': '',
        'X-AUTH-TOKEN': ''
      },
    })

    async function loadUsers() {
      try {
        console.log(axiosConfig)
        const res = await axios.get(`${API_URL.value}/api/users`, axiosConfig.value)
        this.users = res.data
        if (res.status === 200) {
          Object.keys(res.data).forEach((element) => {
            userMapping[res.data[element].accountNumber] = res.data[element].id
            userNameMappings[res.data[element].id] = res.data[element].alias
          })
        }
        console.log("USERMAPPINGS", userMapping)
      } catch (err) {
        console.log(err)
      }
    }
    async function loadProjects() {
      try {
        const res = await axios.get(`${API_URL.value}/api/projects`, axiosConfig.value)
        this.projects = res.data
        this.selectedProject = res.data[0]
      } catch (err) {
        console.log(err)
      }
    }
    async function loadActivities() {
      try {
        const res = await axios.get(`${API_URL.value}/api/activities?project=${this.selectedProject.id}`, axiosConfig.value)
        this.activities = res.data
        this.selectedActivity = res.data[0]
      } catch (err) {
        console.log(err)
      }
    }

    async function startTimesheetRecord(userId: Number, activityId: Number, projectId: Number) {
      try {
        const data = {
          project: projectId,
          activity: activityId,
          user: userId,
          billable: true
        }
        const res = await axios.post(`${API_URL.value}/api/timesheets`, data, axiosConfig.value)
        if (res.status === 200){
          showConfirmationDialog(userId, "Sign-In")
        }
        return res.data
      } catch (err) {
        console.log(err)
      }
    }

    async function endTimesheetRecord(recordId: Number, userId: Number) {
      try {
        const res = await axios.get(
          `${API_URL.value}/api/timesheets/${recordId}/stop`,
          axiosConfig.value
        )
        if (res.status === 200){
          showConfirmationDialog(userId, "Sign-Out")
        }
      } catch (err) {
        console.log(err)
      }
    }

    async function toggleTimesheetRecordState(userAccNumber: Number) {
      let userId = userMapping[userAccNumber]
      console.log("USERID", userAccNumber)
      let runningRecord = await getUnfinishedTimesheetRecord(userId)
      if (runningRecord) {
        console.log("RUNNING",runningRecord)
        endTimesheetRecord(runningRecord['id'], userId)
      } else {
        console.log(this.selectedActivity)
        console.log(this.selectedProject)
        startTimesheetRecord(userId, this.selectedActivity.id, this.selectedProject.id)
      }
    }

    async function getUnfinishedTimesheetRecord(userId){
      // Get active records for given user
      console.log("AXIOSCONF", axiosConfig.value)
      const res = await axios.get(`${API_URL.value}/api/timesheets?user=${userId}&active=1&orderBy=id&order=DESC`, axiosConfig.value)
      // Return the most recently STARTED activity (by id, not time)
      return res.data[0]
    }

    async function showConfirmationDialog(userId, targetState){
      dialogName.value = userNameMappings[userId]
      dialogTitle.value = targetState
      showDialog.value = true
      setTimeout(() => {
        showDialog.value = false
      }, 3000)
    }
    return {
      userMapping,
      currentlyRunningRecords,
      users,
      projects,
      activities,
      selectedProject,
      selectedActivity,
      loadUsers,
      loadProjects,
      loadActivities,
      startTimesheetRecord,
      toggleTimesheetRecordState,
      API_URL,
      axiosConfig,
      getUnfinishedTimesheetRecord,
      showDialog,
      dialogName,
      dialogTitle

    }
  },
  {
    persist: true
  }
)
