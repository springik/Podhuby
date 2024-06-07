<template>
  <ReportTable />
</template>

<script>
import ReportTable from './ReportTable.vue'

export default {
    name: 'AdminDashboard',
    components: { ReportTable },
    data() {
        return {
            reports: []
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>