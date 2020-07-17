<template>
    <div class="popup">
        <el-row>
            <el-col :span="24">
                <h2>Switch Domain</h2>
                <el-menu :default-active="activeEnvId">
                    <el-menu-item v-for="env in environments" :key="env.id" :index="env.id" @click="selectEnv(env, $event)">
                        {{ env.label }}
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <el-footer>
            <el-button type="primary" size="small" icon="el-icon-setting" plain @click="loadSettings">
                Change Settings
            </el-button>
        </el-footer>
    </div>
</template>

<script>
import { goToOptionsPage, sendMessageSwitchDomain } from '../helpers/browser';
import { getMatchingEnvironmentForUrl } from '../helpers/url';
import { mapGetters } from 'vuex';

export default {
    name: 'Popup',
    props: {
        currentTabURL: {
            type: String,
            required: true,
        },
    },

    mounted() {
        console.log('Popup.mounted', this.currentTabURL, this.projects);
        this.updateEnvironments();

        if (typeof process.env.BUILD_VERSION !== 'undefined') {
            console.log('Popup - Version ' + process.env.BUILD_VERSION);
        }
    },

    data() {
        return {
            environments: [],
            activeEnvId: null,
        };
    },

    watch: {
        currentTabURL(value) {
            console.log('watcher: currentTabURL', value);
            if (value) {
                this.updateEnvironments();
            }
        },
        projects(value) {
            console.log('watcher: projects', value);
            if (value) {
                this.updateEnvironments();
            }
        },
    },

    computed: {
        ...mapGetters({
            projects: 'projects',
        }),
    },

    methods: {
        loadSettings() {
            goToOptionsPage();
        },

        updateEnvironments() {
            console.group('updateEnvironments');
            if (!this.projects || !this.currentTabURL) {
                console.debug('-> skipped', this.projects, this.currentTabURL);
                return;
            }

            const environment = getMatchingEnvironmentForUrl(this.projects, this.currentTabURL);
            console.debug('getMatchingEnvironmentForUrl', environment);
            this.activeEnvId = environment.id;

            const filteredProjects = this.$store.getters.projectById(environment.projectId);
            const project = filteredProjects[0] || null;
            console.debug('filteredProjects: ', filteredProjects);
            console.debug('=> project: ', project);

            this.environments = project.environments;
            console.debug('Updated Environments', this.environments);
            console.groupEnd();
        },

        selectEnv(env) {
            console.log('selectEnv', env);
            const url = new URL(this.currentTabURL);

            // TODO
            // const openInNewTab = ($event.modifier.altKey || $event.modifier.ctrlKey || $event.modifier.metaKey);

            sendMessageSwitchDomain(url, env);
        },
    },
};
</script>

<style lang="scss">
.popup {
    .el-row {
        margin-bottom: 10px;
    }

    .el-menu {
        border: 0;
    }

    .el-menu-item {
        &:hover {
            background-color: #ebeef5;
        }

        &.is-active {
            font-weight: bold;
            color: rgb(100, 149, 237);
        }
    }
}
</style>
