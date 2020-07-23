<template>
    <el-card shadow="hover" class="project">
        <div slot="header">
            <el-row>
                <el-col :span="18">
                    <el-input v-if="editMode" v-model="projectName" @change="save" @keyup.enter="save"></el-input>
                    <span v-else class="project__label" @click="edit">{{ project.name }}</span>
                </el-col>
                <el-col :span="6">
                    <el-button v-if="editMode" icon="edit" style="float: right" size="medium" type="success" plain @click="save">Save</el-button>
                    <el-button v-else icon="edit" style="float: right" size="medium" type="primary" plain @click="edit">Edit</el-button>
                </el-col>
            </el-row>
        </div>
        <el-switch v-model="project.useRegExp" @change="save" active-color="#13ce66" active-text="use Regular Expressions"></el-switch>
        <el-switch v-model="project.useBadges" @change="save" active-color="#13ce66" active-text="use Badges"></el-switch>
        <el-table :data="project.environments" empty-text="No Environments added yet.">
            <el-table-column prop="position" label="#" width="50">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column v-if="project.useBadges" prop="badgeColor" label="" width="50">
                <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.badgeColor" size="medium" @change="updateEnv(scope.row)"></el-color-picker>
                </template>
            </el-table-column>
            <el-table-column v-if="project.useBadges" prop="badgeText" label="Badge" width="120">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.badgeText" @change="updateEnv(scope.row)" maxlength="3" show-word-limit class="options__badge-text" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="label" label="Label" width="300">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.label" @change="updateEnv(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="pattern" label="URL Pattern" width="auto">
                <template slot-scope="scope">
                    <el-input placeholder="localhost" v-model="scope.row.pattern" @change="updateEnv(scope.row)" class="input-with-select">
                        <el-select v-model="scope.row.protocol" @change="updateEnv(scope.row)" slot="prepend" placeholder="Select">
                            <el-option label="https://" value="https"></el-option>
                            <el-option label="http://" value="http"></el-option>
                        </el-select>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column v-if="project.useRegExp" prop="patternTarget" label="Target URL" width="auto">
                <template slot-scope="scope">
                    <el-input placeholder="$1.org" v-model="scope.row.patternTarget" @change="updateEnv(scope.row)" class="input-with-select">
                        <template slot="prepend">{{ scope.row.protocol }}://</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="Operations" width="120">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="deleteEnvironment(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br />
        <el-button type="success" icon="plus" @click="addEnvironment">Add Environment</el-button>
    </el-card>
</template>

<script>
import { Project } from '../models/Project';

export default {
    name: 'ProjectRow',
    props: {
        project: {
            type: Project,
            required: true,
        },
    },

    data() {
        return {
            editMode: false,
            projectName: this.project.name,
        };
    },

    methods: {
        edit() {
            this.editMode = true;
        },
        save() {
            this.editMode = false;
            this.project.name = this.projectName;

            this.$store.dispatch('updateProject', this.project).then(() => {
                this.saveSettings();
            });
        },

        saveSettings() {
            this.$store.dispatch('saveSettings').then(() => {
                this.$message.success('Successfully saved.');
            });
        },

        addEnvironment() {
            this.$store.dispatch('addEnvironment', { projectId: this.project.id });
        },

        editEnvironment(index, row) {},

        deleteEnvironment(index, row) {
            console.debug('ProjectRow.deleteEnvironment', index, row);
            this.$store.dispatch('deleteEnvironment', { projectId: row.projectId, environmentId: row.id }).then(() => {
                this.saveSettings();
            });
        },

        updateEnv(row) {
            console.debug('ProjectRow.updateEnv', row);
            this.$store.dispatch('updateEnvironment', row).then(() => {
                this.saveSettings();
            });
        },
    },
};
</script>

<style lang="scss">
.el-card__header {
    background: #f5f5f5;
}

.el-select .el-input {
    width: 92px;
}

.options__badge-text.el-input {
    width: 100px;
}

.project {
    &__label {
        font-size: 16px;
    }
}
</style>
