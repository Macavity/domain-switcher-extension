<template>
  <el-card shadow="hover" class="project">
    <div slot="header">
      <input v-if="editMode" type="text" v-model="projectName" @blur="save" @keyup.enter="save" />
      <span class="project__label" v-else @click="edit">{{ project.name }}</span>
      <el-button icon="edit" style="float: right" size="medium" type="primary" plain @click="edit">Edit</el-button>
    </div>
    <el-table :data="project.environments" empty-text="No Environments added yet.">
      <el-table-column prop="position" label="#" width="50"></el-table-column>
      <el-table-column prop="label" label="Label" width="300"></el-table-column>
      <el-table-column prop="url" label="URL" width="auto"></el-table-column>
      <el-table-column label="Operations">
        <template slot-scope="scope">
          <el-button size="mini" @click="editEnvironment(scope.$index, scope.row)">Edit</el-button>
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
        this.$store.dispatch('saveSettings');
      });
    },

    addEnvironment() {
      this.$store.dispatch('addEnvironment', { projectId: this.project.id });
    },

    editEnvironment(index, row) {},

    deleteEnvironment(index, row) {
      console.log('delete', index, row);
      this.$store.dispatch('deleteEnvironment', { projectId: row.projectId, environmentId: row.id });
    },
  },
};
</script>

<style lang="scss">
.el-card__header {
  background: #f5f5f5;

  .el-button {
    margin-top: -8px;
  }
}

.project {
  &__label {
    font-size: 16px;
  }
}
</style>
