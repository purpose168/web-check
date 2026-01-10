<script lang="ts">
  // 导入 FontAwesome 的 Svelte 组件
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  // 导入品牌图标库（如 GitHub 等）
  import * as brands from '@fortawesome/free-brands-svg-icons';
  // 导入实心图标库（如 check、plus 等）
  import * as solidIcons from '@fortawesome/free-solid-svg-icons';
  // 导入图标定义类型
  import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';


  // 导出图标映射表：将图标名称映射到对应的图标定义
  // Record<string, IconDefinition> 表示键为字符串，值为图标定义的对象类型
  export const iconMap: Record<string, IconDefinition> = {
    check: solidIcons.faCheck,      // 勾选图标
    plus: solidIcons.faPlus,        // 加号图标
    github: brands.faGithubAlt,     // GitHub 图标（品牌）
    code: solidIcons.faCode,        // 代码图标
    rocket: solidIcons.faRocket,    // 火箭图标
    copy: solidIcons.faCopy,        // 复制图标
  };

  // 导出组件属性（props）
  // name：图标名称，必填，对应 iconMap 中的键
  export let name: string;
  // size：图标大小，默认为 1rem
  export let size: number = 1;
  // color：图标颜色，默认为 currentColor（继承父元素颜色）
  export let color: string = 'currentColor';
  // styles：自定义样式字符串，默认为空
  export let styles: string = '';

</script>

<!-- 条件渲染：如果图标名称存在于 iconMap 中，则渲染图标 -->
{#if iconMap[name]}
  <!-- FontAwesome 图标组件 -->
  <FontAwesomeIcon 
    class="fa-icon"
    <!-- 使用 CSS 变量设置图标大小和颜色 -->
    style={`--icon-size: ${size}rem; --icon-color: ${color}; ${styles}`}
    <!-- 从 iconMap 中获取对应的图标定义 -->
    icon={iconMap[name]} />
{/if}

<style>
  <!-- 全局样式：应用到所有 .fa-icon 类的元素 -->
  :global(.fa-icon) {
    <!-- 使用 CSS 变量设置图标宽度，默认为 1rem -->
    width: var(--icon-size, 1rem);
    <!-- 使用 CSS 变量设置图标颜色，默认为 currentColor -->
    color: var(--icon-color, currentColor);
  }
</style>
