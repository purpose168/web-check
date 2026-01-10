
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';
import colors from 'web-check-live/styles/colors';

// 卡片样式定义，设置横幅图片和颜色字段的样式
const cardStyles = `
  .banner-image img {
    width: 100%;
    border-radius: 4px;
    margin: 0.5rem 0;
  }
  .color-field {
    border-radius: 4px;
    &:hover {
      color: ${colors.primary};
    }
  }
`;

// Open Graph横幅组件，用于显示网站的横幅图片
const OgBanner = ({ ogImage, ogUrl }: { ogImage: string; ogUrl?: string }): JSX.Element => {
  // 处理图片URL，如果是相对路径则拼接基础URL
  const urlCover = ogImage.startsWith("/") && ogUrl ? `${ogUrl}${ogImage}` : ogImage;
  return (
      <div className="banner-image">
          <img src={urlCover} alt="横幅" />
      </div>
  );
};

// 社交标签卡片组件，用于显示网站的社交媒体元标签信息
const SocialTagsCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {
  // 从props中解构获取社交标签数据
  const tags = props.data;
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      { tags.title && <Row lbl="标题" val={tags.title} /> }
      { tags.description && <Row lbl="描述" val={tags.description} /> }
      { tags.keywords && <Row lbl="关键词" val={tags.keywords} /> }
      { tags.canonicalUrl && <Row lbl="规范URL" val={tags.canonicalUrl} /> }
      { tags.themeColor && <Row lbl="" val="">
        <span className="lbl">主题颜色</span>
        <span className="val color-field" style={{background: tags.themeColor}}>{tags.themeColor}</span>
      </Row> }
      { tags.twitterSite && <Row lbl="" val="">
        <span className="lbl">Twitter账号</span>
        <span className="val"><a href={`https://x.com/${tags.twitterSite}`}>{tags.twitterSite}</a></span>
      </Row> }
      { tags.author && <Row lbl="作者" val={tags.author} />}
      { tags.publisher && <Row lbl="发布者" val={tags.publisher} />}
      { tags.generator && <Row lbl="生成器" val={tags.generator} />}
      {tags.ogImage && <OgBanner ogImage={tags.ogImage} ogUrl={tags.ogUrl} />}
    </Card>
  );
}

export default SocialTagsCard;
