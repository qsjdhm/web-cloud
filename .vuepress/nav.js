var GuideNav = {
	essentials: [
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
	],
	advanced: [
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
	],
	other: [
		'/docs/guide/other/gitter.md',
		'/docs/guide/other/release-notes.md'
	]
}

var ElementComponentNav = [
	{
		text: '元素组件',
		items: [
			{
				text: '文本框',
				link: '/components/webcl-input/'
			},
			{
				text: '选择框',
				link: '/components/webcl-select/'
			},
			{
				text: '搜索',
				link: '/components/webcl-search/'
			}
		]
	}
]

var BusinessComponentNav = [
	{
		text: '业务组件',
		items: [
			{
				text: '富文本',
				link: '/docs/feature/component/rich-editor.md'
			},
			{
				text: 'Markdown 编辑器',
				link: '/docs/feature/component/markdown-editor.md'
			},
			{
				text: 'Svg Icon 图标',
				link: '/docs/feature/component/svg-icon.md'
			},
			{
				text: '复制粘贴',
				link: '/docs/feature/component/clipboard.md'
			},
			{
				text: 'Excel',
				link: '/docs/feature/component/excel.md'
			},
			{
				text: 'Pagination 分页',
				link: '/docs/feature/component/pagination.md'
			},
			{
				text: 'Tree Table 树形表格',
				link: '/docs/feature/component/tree-table.md'
			}
		]
	},
	{
		text: 'Script 命令',
		items: [
			{
				text: 'Svgo',
				link: '/docs/feature/script/svgo.md'
			},
			{
				text: 'New',
				link: '/docs/feature/script/new.md'
			}
		]
	}
]

var EcosystemNav = [
	{
		text: '项目',
		items: [
			{
				text: 'vue-element-admin',
				link: 'https://github.com/PanJiaChen/vue-element-admin'
			},
			{
				text: 'vue-admin-template',
				link: 'https://github.com/PanJiaChen/vue-admin-template'
			},
			{
				text: 'electron-vue-admin',
				link: 'https://github.com/PanJiaChen/electron-vue-admin'
			},
			{
				text: 'vue-typescript-admin-template',
				link: 'https://github.com/Armour/vue-typescript-admin-template'
			},
			{
				text: 'awesome-project',
				link: 'https://github.com/PanJiaChen/vue-element-admin/issues/2312'
			},
			{
				text: 'vue-countTo',
				link: 'https://github.com/PanJiaChen/vue-countTo'
			},
			{
				text: 'vue-split-pane',
				link: 'https://github.com/PanJiaChen/vue-split-pane'
			},
			{
				text: 'awesome-bookmarks',
				link: 'https://github.com/PanJiaChen/awesome-bookmarks'
			}
		]
	},
	{
		text: '帮助',
		items: [
			{
				text: '国内文档(解决Github.io访问慢的问题)',
				link: 'https://panjiachen.gitee.io/vue-element-admin-site/zh'
			},
			{
				text: 'Gitter讨论组',
				link: 'https://gitter.im/vue-element-admin/discuss'
			},
			{
				text: '作者Blog',
				link: 'https://jianshiapp.com/circles/1209'
			},
			{
				text: '常见问题',
				link: '/guide/other/faq.md'
			},
			{
				text: 'QQ群',
				link: 'https://github.com/PanJiaChen/vue-element-admin/issues/602'
			},
			{
				text: '作者个人微博',
				link: 'https://weibo.com/u/3423485724'
			},
			{
				text: '更新记录',
				link: 'https://github.com/PanJiaChen/vue-element-admin/releases'
			}
		]
	}
]

module.exports = {
	GuideNav,
	EcosystemNav,
	ElementComponentNav,
	BusinessComponentNav
}
