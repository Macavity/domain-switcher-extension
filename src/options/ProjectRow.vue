<template>
  <el-card shadow="hover" class="project">
    <div slot="header">
      <input v-if="editMode" type="text" v-model="projectName" @blur="save" @keyup.enter="save" />
      <span class="project__label" v-else @click="edit">{{ project.name }}</span>
      <el-button icon="edit" style="float: right" size="medium" type="primary" plain @click="edit">Edit</el-button>
    </div>
    <el-table :data="project.environments" empty-text="No Environments added yet.">
      <el-table-column prop="position" label="#" width="10"> </el-table-column>
      <el-table-column prop="label" label="Label" width="100"> </el-table-column>
      <el-table-column prop="url" label="URL" width="200"> </el-table-column>
      <el-table-column label="Operations">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-button type="success" icon="plus">Add Environment</el-button>
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

    handleEdit(index, row) {},

    handleDelete(index, row) {},
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
