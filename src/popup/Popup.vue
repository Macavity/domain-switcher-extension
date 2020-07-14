<template>
    <div class="popup">
        <h4>Switch Domain</h4>
        <div class="popup-list">
            <a v-for="env in envs" @click="selectEnv(env.id, $event)" class="popup-list__item">{{ env.label }}</a>
        </div>

        <a class="pull-right" id="settings" href="#" @click="loadSettings()"><span class="glyphicon glyphicon-wrench"></span> Options</a>
        <div class="clearfix"></div>
    </div>
</template>

<script>
export default {
    name: 'Popup',
    data() {
        return {
            envs: [],
        };
    },
    methods: {
        loadSettings() {
            chrome.tabs.create({ url: chrome.extension.getURL('options.html') });
        },
    },
};
</script>
