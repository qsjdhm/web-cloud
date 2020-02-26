var nav = require('./nav.js')
var {EcosystemNav, ElementComponentNav, BusinessComponentNav} = nav

var utils = require('./utils.js')
var {genNav, getComponentSidebar, deepClone} = utils

module.exports = {
	title: 'web-cloud',
	description: 'A magical web cloud',
	markdown: { //markdown编辑器的配置
		lineNumbers: true, //代码显示行号，默认 false
		toc: {includeLevel: [3]}, //显示目录的默认层级
	},
	base: '/web-cloud-site/',
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/favicon.ico'
			}
		]
	],
	themeConfig: {
		repo: 'https://github.com/qsjdhm/web-cloud',
		docsRepo: 'https://github.com/qsjdhm/web-cloud/docs',
		docsDir: '/',
		editLinks: true,
		sidebarDepth: 3,
		locales: {
			'/': {
				label: '简体中文',
				selectText: '选择语言',
				editLinkText: '在 GitHub 上编辑此页',
				nav: [
					{
						text: '指南',
						link: '/docs/guide/'
					},
					{
						text: '元素组件',
						items: genNav(deepClone(ElementComponentNav))
					},
					{
						text: '业务组件',
						items: genNav(deepClone(BusinessComponentNav))
					},
					{
						text: '生态系统',
						items: genNav(deepClone(EcosystemNav))
					},
					{
						text: '捐赠',
						link: '/docs/donate/'
					},
					{
						text: '招聘',
						link: '/docs/job/'
					}
				],
				sidebar: {
					'/docs/guide/': [
						{
							title: '基础',
							collapsable: false,
							children: genEssentialsSidebar()
						},
						{
							title: '进阶',
							collapsable: false,
							children: genAdvancedSidebar()
						},
						{
							title: '其它',
							collapsable: false,
							children: [
								'/docs/guide/other/gitter.md',
								'/docs/guide/other/release-notes.md'
							]
						}
					],

					'/components/': getComponentSidebar(deepClone(ElementComponentNav)),
					'/docs/feature/component/': getComponentSidebar(deepClone(BusinessComponentNav)),
					'/docs/feature/script/': [
						'/docs/feature/script/svgo.md',
						'/docs/feature/script/new.md'
					]
				}
			}
		}
	},
	locales: {
		'/': {
			lang: 'zh-CN',
			description: 'A magical web cloud'
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@public': './public'
			}
		}
	},
	// 文档更新时间：每个文件git最后提交的时间,
	lastUpdated: 'Last Updated'
}

function genEssentialsSidebar(type = '') {
	const mapArr = [
		'/docs/guide/',
		'/docs/guide/essentials/layout.md',
		'/docs/guide/essentials/router-and-nav.md',
		'/docs/guide/essentials/permission.md',
		'/docs/guide/essentials/tags-view.md',
		'/docs/guide/essentials/new-page.md',
		'/docs/guide/essentials/style.md',
		'/docs/guide/essentials/server.md',
		'/docs/guide/essentials/mock-api.md',
		'/docs/guide/essentials/import.md',
		'/docs/guide/essentials/deploy.md',
		'/docs/guide/essentials/env.md'
	]
	return mapArr.map(i => {
		return type + i
	})
}

function genAdvancedSidebar(type = '') {
	const mapArr = [
		'/docs/guide/advanced/cors.md',
		'/docs/guide/advanced/eslint.md',
		'/docs/guide/advanced/git-hook.md',
		'/docs/guide/advanced/style-guide.md',
		'/docs/guide/advanced/lazy-loading.md',
		'/docs/guide/advanced/chart.md',
		'/docs/guide/advanced/icon.md',
		'/docs/guide/advanced/cdn.md',
		'/docs/guide/advanced/theme.md',
		'/docs/guide/advanced/i18n.md',
		'/docs/guide/advanced/error.md',
		'/docs/guide/advanced/webpack.md'
	]
	return mapArr.map(i => {
		return type + i
	})
}
