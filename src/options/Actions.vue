<template>
    <div class="option-actions">
        <el-col :span="24">
            <el-button @click="addProject" type="primary">Add Project</el-button>
            <el-button type="info" icon="el-icon-download" @click="exportSettings" plain>Export</el-button>
            <el-button type="danger" icon="el-icon-upload2" @click="openImportDialog" plain>Import</el-button>
        </el-col>
    </div>
</template>

<script>
import { exportSettings } from '../helpers/browser';

export default {
    name: 'Actions',
    methods: {
        addProject() {
            this.$store.dispatch('addProject');
        },

        exportSettings() {
            const projects = this.projects;
            exportSettings(projects);
        },

        openImportDialog() {
            this.$store.dispatch('showImportDialog');
        },
    },
};
</script>

<style scoped></style>
