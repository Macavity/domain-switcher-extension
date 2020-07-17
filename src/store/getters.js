export const projects = state => state.projects;
export const isSaving = state => state.isSaving;

export const projectById = state => {
    return projectId =>
        state.projects.filter(item => {
            return item.id === projectId;
        });
};
