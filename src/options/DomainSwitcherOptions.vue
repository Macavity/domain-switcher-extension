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
        <el-button type="primary" @click="save">Save settings</el-button>
        <el-alert v-if="showSaveAlert" type="success" title="Successfully saved." show-icon></el-alert>
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

  computed: {
    ...mapGetters(['projects']),
  },

  methods: {
    addProject() {
      this.$store.dispatch('addProject');
    },

    save() {
      this.$store.dispatch('saveSettings');
      this.showSaveAlert = true;

      setTimeout(() => {
        this.showSaveAlert = false;
      }, 5000);
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
