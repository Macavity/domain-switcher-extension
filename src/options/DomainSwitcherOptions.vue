<template>
  <div class="options">
    <el-container>
      <el-header>
        <h2>Domain Switcher - Settings</h2>
      </el-header>
      <el-main>
        <h3>Projects</h3>

        <el-button @click="addProject" type="primary">Add Project</el-button>

        <div class="projects-list">
          <div v-for="project in projects" class="panel panel-default" ng-class="{'panel-default': project.enabled}">
            <div class="panel-heading" ng-mouseenter="project.showEdit = true" ng-mouseleave="project.showEdit = false">
              <span class="panel-title" ng-hide="project.editMode">{{ project.name }}</span>

              <span ng-show="project.editMode">
                <input type="text" placeholder="New Project Name" ng-model="project.name" ng-blur="doneEditName(project)" />
              </span>

              <span class="pull-right panel-right-heading">
                <a href="#" class="panel-heading-link" ng-show="project.showEdit  && !project.editMode" ng-click="editName(project)"
                  ><span class="glyphicon glyphicon-edit"></span> edit name</a
                >

                <a href="#" class="panel-heading-link rem-proj" ng-click="removeProject($index)"><span class="glyphicon glyphicon-remove"></span></a>
              </span>
            </div>
            <div class="panel-body">
              <div class="row">
                <div ng-repeat="env in project.envs" class="col-sm-4 col-md-3">
                  <div class="form-group">
                    <input type="text" class="form-control" placeholder="Eg: localhost:3000" ng-model="env.url" />
                  </div>
                </div>
                <div class="col-sm-4 col-md-3">
                  <div class="form-group">
                    <button type="button" class="btn btn-primary btn-sm" ng-click="addEnv(project)" role="button">
                      <span class="glyphicon glyphicon-plus-sign"></span> Add env
                    </button>
                  </div>
                </div>
              </div>
              <!-- row -->
            </div>
            <!-- panel body -->
          </div>
          <!-- panel -->
        </div>
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

export default {
  name: 'DomainSwitcherOptions',

  data() {
    return {
      showSaveAlert: false,
    };
  },

  computed: {
    ...mapGetters(['projects']),
  },

  methods: {
    addProject() {},

    save() {
      this.$store.dispatch('saveSettings');
      this.showSaveAlert = true;

      setTimeout(() => {
        this.showSaveAlert = false;
      }, 5000);
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
