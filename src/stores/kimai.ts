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

  async function loadUsers() {
    try {
      const res = await axios.get('http://localhost:8001/api/users', axiosConfig)
      this.users = res.data
    } catch (err) {
      console.log(err)
    }
  }
  async function loadProjects() {
    try {
      const res = await axios.get('http://localhost:8001/api/projects', axiosConfig)
      this.projects = res.data
    } catch (err) {
      console.log(err)
    }
  }
  async function loadActivities() {
    try {
      const res = await axios.get('http://localhost:8001/api/activities', axiosConfig)
      this.activities = res.data
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

  async function endTimesheetRecord(recordId: Number) {
    try {
      const res = await axios.get(`http://localhost:8001/api/timesheets/${recordId}/stop`, axiosConfig)
    } catch (err) {
      console.log(err)
    }
  }

  return {users,projects,activities,loadUsers,loadProjects,loadActivities, startTimesheetRecord}
})
