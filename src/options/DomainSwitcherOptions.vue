<template>
    <div class="options">
        <el-container>
            <el-header>
                <h2>Domain Switcher - Settings</h2>
            </el-header>
            <el-main>
                <h3>Projects</h3>

                <ImportDialog />

                <el-row>
                    <Actions />
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
                <Actions />
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectRow from './ProjectRow';
import { exportSettings } from '../helpers/browser';
import Actions from './Actions';
import ImportDialog from './ImportDialog';

export default {
    name: 'DomainSwitcherOptions',
    components: { ImportDialog, Actions, ProjectRow },
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
        save() {
            this.$store.dispatch('saveSettings').then(() => {
                this.$message.success('Successfully saved.');
            });
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
