<template>
    <el-dialog title="Import Settings" :visible="importDialogOpen" @close="closeImportDialog">
        <el-form ref="form" :model="importForm" :rules="rules" validate-on-rule-change>
            <el-alert show-icon type="warning"><strong>Warning</strong> The import will replace all current settings. </el-alert>
            <el-form-item label="Import Data" prop="data" label-width="100">
                <el-input v-model="importForm.data" type="textarea" autosize spellcheck="false" placeholder="Please input exported JSON content"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeImportDialog">Cancel</el-button>
            <el-button type="primary" @click="confirmImport">Confirm</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ImportDialog',
    computed: {
        ...mapGetters(['importDialogOpen']),
    },

    data() {
        return {
            importForm: {
                data: '',
            },
            rules: {
                data: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: 'Insert file content from an exported settings JSON file.',
                    },
                    {
                        validator: this.validateJSON,
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    methods: {
        validateJSON(rule, value, callback) {
            const result = this.isValidJSONString(value);
            console.log('validator', result);

            if (!result) {
                callback(new Error('Invalid JSON.'));
                return false;
            }

            callback();
            return result;
        },
        closeImportDialog() {
            this.$store.dispatch('hideImportDialog');
        },

        confirmImport() {
            console.log('confirmImport');
            this.$refs['form'].validate(valid => {
                console.log('form validate', valid);

                if (valid) {
                    this.$store
                        .dispatch('importSettings', this.importForm.data)
                        .then(result => {
                            console.log('result', result);
                            console.log('result', typeof result);
                            if (result) {
                                this.$message.success('Settings imported.');
                                this.closeImportDialog();
                            } else {
                                this.$message.error('No Settings were imported, because no valid projects were contained in the imported data.');
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            this.$message.error(error.message);
                        });
                } else {
                    console.warn('form invalid');
                    return false;
                }
            });
        },

        isValidJSONString(string) {
            try {
                JSON.parse(string);
            } catch (e) {
                console.log('isValidJSONString', e);
                return false;
            }

            return true;
        },
    },
};
</script>

<style scoped></style>
