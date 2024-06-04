<template>
  <table class="text-white table-auto border-collapse w-1/2 text-center border-spacing-2">
    <thead>
        <tr>
            <th class="p-4">
                Reason
            </th>
            <th class="p-4">
                Report Date
            </th>
            <th class="p-4">
                Comment
            </th>
            <th class="p-4">
                Commenter nick
            </th>
            <th class="p-4">
                Interactions
            </th>
        </tr>
    </thead>
    <tbody>
        <tr class="even:bg-accentColor odd:bg-tertiaryColor" v-for="(report, index) in reports" :key="report.id+index">
            <td class="p-4 podcast-p-shadow">
                {{ report.reason }}
            </td>
            <td class="p-4 podcast-p-shadow">
                {{ formattedDate(report.createdAt) }}
            </td>
            <td class="p-4 podcast-p-shadow">
                {{ `"${report.comment.content}"` }}
            </td>
            <td class="p-4 podcast-p-shadow">
                {{ report.comment.author.nickname }}
            </td>
            <!-- interactions -->
            <td class="p-4">
                <button title="Delete Report" class="p-2" :class="{'submit-btn-min-alt': index % 2 == 1, 'submit-btn-min': index % 2 == 0}" @click="deleteReport(report.id)">
                    <img class="w-6 h-6" src="/delete-icon.svg" alt="delete">
                </button>
                <button title="Ban user" class="p-2" :class="{'submit-btn-min-alt': index % 2 == 1, 'submit-btn-min': index % 2 == 0}" @click="banUser(report)">
                    <img class="w-6 h-6" src="/ban-icon.png" alt="ban">
                </button>
            </td>
        </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'
import moment from 'moment'
import { useUserStore } from '../stores/userStore'

export default {
    name: 'ReportTable',
    setup() {
        const toast = useToast()
        const userStore = useUserStore()
        return {
            toast,
            userStore
        }
    },
    data() {
        return {
            reports: []
        }
    },
    methods: {
        async getReports() {
            const url = `/api/admin/get-reports`
            const params =
            {
                lastSeenString: '',
                limit: 100
            }
            try
            {
                this.toast.info('Requesting reports...')
                const result = await axios.get(url, { params, headers: { withCredentials: true } })
                console.log(result);
                this.reports = result.data
            }
            catch (err)
            {
                console.log(err);
                if(err.status == 404)
                    return this.toast.info(err.response?.data?.message)

                this.toast.error(err.response?.data?.message)
            }
        },
        async deleteReport(reportId) {
            //delete report
            this.toast.info('deleting report')
            const url = `/api/admin/report/${reportId}`

            try
            {
                const result = await axios.delete(url, { withCredentials: true })
                console.log('deletion result', result);
                this.toast.success(result.data.message)
                this.removeReport(reportId)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response?.data?.message)
            }
        },
        async banUser(report) {
            this.toast.info('banning user...')
            const url = `/api/admin/ban/${report.comment.author_id}`
            console.log('report', report);

            try
            {
                const response = await axios.put(url, { withCredentials: true })
                console.log(response);
                this.toast.success(response.data.message)
                this.removeReport(report.id)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error('Failed to ban user')
            }
        },
        removeReport(reportId) {
            this.reports = this.reports.filter(report => report.id != reportId)
        }
    },
    async mounted() {
        await this.getReports()
    },
    computed: {
        formattedDate() {
            return (date) => moment(date).format("MMMM Do YYYY, h:mm:ss a")
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>