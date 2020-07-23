<template>
    <div class="popup">
        <el-row>
            <el-col :span="24">
                <h2>Switch Domain</h2>
                <div v-if="!activeEnvId" class="tip">Not a registered URL.</div>
                <el-menu :default-active="activeEnvId">
                    <el-menu-item v-for="targetEnv in targetEnvironments" :key="targetEnv.id" :index="targetEnv.id" @click="selectEnv(targetEnv, $event)">
                        {{ targetEnv.label }}
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
import { TargetEnvironmentFactory } from '../models/TargetEnvironmentFactory';

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
            targetEnvironments: [],
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
                //console.debug('-> skipped', this.projects, this.currentTabURL);
                return;
            }

            const currentEnv = getMatchingEnvironmentForUrl(this.projects, this.currentTabURL);
            //console.debug('getMatchingEnvironmentForUrl', environment);
            this.activeEnvId = currentEnv.id;

            const filteredProjects = this.$store.getters.projectById(currentEnv.projectId);
            const project = filteredProjects[0] || null;
            //console.debug('filteredProjects: ', filteredProjects);
            //console.debug('=> project: ', project);

            this.targetEnvironments = TargetEnvironmentFactory.createCollection(project, this.currentTabURL, currentEnv);
            console.debug('Updated Environments', this.targetEnvironments);
            console.groupEnd();
        },

        /**
         * @param {TargetEnvironment} targetEnv
         */
        selectEnv(targetEnv) {
            console.log('selectEnv', targetEnv);
            const currentUrl = this.currentTabURL;

            // TODO
            // const openInNewTab = ($event.modifier.altKey || $event.modifier.ctrlKey || $event.modifier.metaKey);

            sendMessageSwitchDomain(currentUrl, targetEnv.targetUrl);
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

.tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
}
</style>
