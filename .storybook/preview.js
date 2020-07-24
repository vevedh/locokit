import Vue from 'vue'
import { addDecorator, addParameters } from '@storybook/vue';
// add element configuration too
import '../src/plugins/element.ts'
import ThemeWrapper from './ThemeWrapper.vue'
import i18n from '../src/plugins/i18n'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

/**
 * Use of a special wrapper to add Tailwind CSS
 */
Vue.component('theme-wrapper', ThemeWrapper)
addDecorator(() => ({
  template: '<vlogistique-wrapper><story></story></vlogistique-wrapper>'
}))

/**
 * Add i18n for storybook
 */
addDecorator(() => ({
  template: '<story/>',
  i18n,
}));
