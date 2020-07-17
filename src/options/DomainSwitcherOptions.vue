<template>
    <div class="options">
        <el-container>
            <el-header>
                <h2>Domain Switcher - Settings</h2>
            </el-header>
            <el-main>
                <h3>Projects</h3>

                <el-row>
                    <el-col :span="24">
                        <el-button @click="addProject" type="primary">Add Project</el-button>
                        <br />
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="project-list">
                            <el-row v-for="(project, key) in projects" :key="`project${key}`">
                                <ProjectRow :project="project" />
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </el-main>

            <el-footer>
                <el-button type="primary" @click="save" :loading="isSaving">Save settings</el-button>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectRow from './ProjectRow';

export default {
    name: 'DomainSwitcherOptions',
    components: { ProjectRow },
    data() {
        return {
            showSaveAlert: false,
        };
    },

    mounted() {
        if (typeof process.env.BUILD_VERSION !== 'undefined') {
            console.log('Options - Version ' + process.env.BUILD_VERSION);
        }
    },

    computed: {
        ...mapGetters(['projects', 'isSaving']),
    },

    methods: {
        addProject() {
            this.$store.dispatch('addProject');
        },

        save() {
            this.$store.dispatch('saveSettings').then(() => {
                this.$message.success('Successfully saved.');
            });
        },

        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
    },
};
</script>

<style lang="scss" scoped>
p {
    font-size: 20px;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}
</style>
