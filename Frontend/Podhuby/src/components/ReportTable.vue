<template>
  <table class="text-white table-auto border-collapse w-1/2 text-center border-spacing-2">
    <thead>
        <tr>
            <th class="p-4 even:bg-accentColor odd:bg-black whitespace-nowrap" @click="toggleColumn('reason')">
                <span>
                    Reason
                </span>
                <img v-show="sortColumn == SortColumn.Reason" class="w-4 h-4 inline" :class="{ 'rotate-180' : rotateArrow }" src="/arrow-down.svg" alt="arrow">
            </th>
            <th class="p-4  even:bg-accentColor odd:bg-black whitespace-nowrap" @click="toggleColumn('report date')">
                <span>
                    Report Date
                </span>
                <img v-show="sortColumn == SortColumn.ReportDate" class="w-4 h-4 inline" :class="{ 'rotate-180' : rotateArrow }" src="/arrow-down-black.png" alt="arrow">
            </th>
            <th class="p-4  even:bg-accentColor odd:bg-black whitespace-nowrap" @click="toggleColumn('comment')">
                <span>
                    Comment
                </span>
                <img v-show="sortColumn == SortColumn.Comment" class="w-4 h-4 inline" :class="{ 'rotate-180' : rotateArrow }" src="/arrow-down.svg" alt="arrow">
            </th>
            <th class="p-4  even:bg-accentColor odd:bg-black whitespace-nowrap" @click="toggleColumn('commenter nick')">
                <span>
                    Commenter nick
                </span>
                <img v-show="sortColumn == SortColumn.CommenterNick" class="w-4 h-4 inline" :class="{ 'rotate-180' : rotateArrow }" src="/arrow-down-black.png" alt="arrow">
            </th>
            <th class="p-4  even:bg-accentColor odd:bg-black">
                <span>Interactions</span>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr class="even:bg-accentColor odd:bg-tertiaryColor" v-for="(report, index) in reports" :key="report.id">
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

const SortColumn = {
    Reason: 'reason',
    ReportDate: 'report date',
    Comment: 'comment',
    CommenterNick: 'commenter nick'
}

export default {
    name: 'ReportTable',
    setup() {
        const toast = useToast()
        const userStore = useUserStore()
        return {
            toast,
            userStore,
            SortColumn
        }
    },
    data() {
        return {
            reports: [],
            sortDirection: 1,
            sortColumn: undefined
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
        toggleColumn(column) {
            this.sortColumn = column
            this.sortDirection = -this.sortDirection
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
        },
        rotateArrow() {
            if(this.sortDirection == 1)
                return true
            if(this.sortDirection == -1)
                return false

            throw new Error('Invalid sort direction')
        },
        sortedData() {
            return this.reports.sort((a, b) => {
                if(!this.sortColumn)
                    return this.reports

                let aVal, bVal

                switch (this.sortColumn) {
                    case SortColumn.Reason:
                        aVal = a.reason
                        bVal = b.reason
                        break;
                    case SortColumn.ReportDate:
                        aVal = a.createdAt
                        bVal = b.createdAt
                        break;
                    case SortColumn.Comment:
                        aVal = a.comment.content
                        bVal = b.comment.content
                        break;
                    case SortColumn.CommenterNick:
                        aVal = a.comment.author.nickname
                        bVal = b.comment.author.nickname
                        break;
                
                    default:
                        throw new Error('Unknown sort column', `${this.sortColumn}`)
                }

                if(this.sortDirection == 1) {
                    if(aVal < bVal)
                        return -1
                    else if(aVal > bVal)
                        return 1

                    return 0
                }
                else if(this.sortDirection == -1) {
                    if(aVal > bVal)
                        return -1
                    else if(aVal < bVal)
                        return 1

                    return 0
                }
            })
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>