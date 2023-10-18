import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useKimaiStore = defineStore('kimai', () => {
  const axiosConfig = {
    headers: {
      'X-AUTH-USER': 'superadmin',
      'X-AUTH-TOKEN': 'k3odpWk9.'
    }
  }

  const users = ref([])
  const projects = ref([])
  const activities = ref([])
  const activeRecords = ref([])

  const selectedProject = ref([])
  const selectedActivity = ref([])
  const currentlyRunningRecords = {}
  const userMapping = {}

  async function loadUsers() {
    try {
      const res = await axios.get('http://localhost:8001/api/users', axiosConfig)
      this.users = res.data
      if (res.status === 200) {
        Object.keys(res.data).forEach(element => {
          userMapping[res.data[element].accountNumber] = res.data[element].id
        });
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function loadProjects() {
    try {
      const res = await axios.get('http://localhost:8001/api/projects', axiosConfig)
      this.projects = res.data
      this.selectedProject = res.data[0]
    } catch (err) {
      console.log(err)
    }
  }
  async function loadActivities() {
    try {
      const res = await axios.get('http://localhost:8001/api/activities', axiosConfig)
      this.activities = res.data
      this.selectedActivity = res.data[0]
    } catch (err) {
      console.log(err)
    }
  }

  async function startTimesheetRecord(userId: Number, activityId: Number, projectId: Number) {
    try {
      const data = {
        "project": projectId,
        "activity": activityId,
        "user": userId,
        "billable": true
      }
      const res = await axios.post('http://localhost:8001/api/timesheets',data, axiosConfig)
      if (res.status === 200) {
        currentlyRunningRecords[userId] = res.data.id
      }
      return res.data
    } catch(err) {
      console.log(err)
    }
  }

  async function getActiveRecords() {
    try {
      const res = await axios.get('http://localhost:8001/api/timesheets/active', axiosConfig)
      this.activeRecords = res.data
    } catch (err) {
      console.log(err)
    }
  }

  async function endTimesheetRecord(recordId: Number, userId: Number) {
    try {
      const res = await axios.get(`http://localhost:8001/api/timesheets/${recordId}/stop`, axiosConfig)
      delete currentlyRunningRecords[userId]
    } catch (err) {
      console.log(err)
    }
  }

  async function toggleTimesheetRecordState(userAccNumber: Number){
    let userId = userMapping[userAccNumber]
    if (userId in currentlyRunningRecords) {
      endTimesheetRecord(currentlyRunningRecords[userId], userId)
    } else {
      console.log(this.selectedActivity)
      console.log(this.selectedProject)
      startTimesheetRecord(userId, this.selectedActivity.id, this.selectedProject.id)
    }
  }

  return {userMapping, currentlyRunningRecords, users,projects,activities, selectedProject, selectedActivity, loadUsers,loadProjects,loadActivities, startTimesheetRecord, toggleTimesheetRecordState}
})
