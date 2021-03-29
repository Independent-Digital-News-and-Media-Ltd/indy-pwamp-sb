/**
 *
 * DO NOT MODIFY
 *
 * The Entry file is required for hydrating the SSR react app in order to provide CMS interaction
 * The data should match that in the routes
 */
import Entry from '@brightsites/flow-core/lib/services/Entry';
import Article from '../../component/pages/Article';
import Section from '../../component/pages/Section';
import StaticPage from '../../component/pages/StaticPage';
import EditionArticle from '../../component/pages/EditionArticle';
import EditionSection from '../../component/pages/EditionSection';

const entry = new Entry(
  {
    article: Article,
    section: Section,
    topic: Section,
    author: Section,
    static: StaticPage,
  },
  {
    article: EditionArticle,
    section: EditionSection,
  },
);
entry.init();
