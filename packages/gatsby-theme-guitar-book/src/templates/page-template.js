import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'gatsby';
import Slugger from 'github-slugger';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { BLOCKS } from '@contentful/rich-text-types';

import striptags from 'striptags';

import styled from '@emotion/styled';

import Img from 'gatsby-image';

import SEO from '../components/seo';
import ContentWrapper from '../components/content-wrapper';
import PageHeader from '../components/page-header';
import Footer from '../components/footer';
import PageContent from '../components/page-content';
import MenuItems from '../components/menu/menu-items';

const Wrapper = styled.div`
  h1 {
    margin-top: -285px;
    padding-top: 285px;
    display: inline-block;
  }
  h2 {
    margin-top: -229px;
    padding-top: 285px;
    display: inline-block;
  }
`;

export default function PageTemplate(props) {
  const { hash, pathname } = props.location;
  const { contentfulPage, contentfulGlobalSettings, sitePage } = props.data;
  const { siteName, description } = contentfulGlobalSettings;
  const { sidebarContents, adSense, baseUrl } = props.pageContext;

  const pages = sidebarContents
    ?.reduce((acc, { pages }) => acc.concat(pages), [])
    .filter((page) => !page.anchor);

  const headings = contentfulPage.body.json.content.map(({ nodeType, content }) => {
    if (['heading-1', 'heading-2'].includes(nodeType)) {
      return content[0].value;
    }
  });

  const getAnchorSlug = (value) => {
    const text = striptags(value);
    const slugger = new Slugger();
    return slugger.slug(text);
  };

  const options = {
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => <h1 id={getAnchorSlug(children[0])}>{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 id={getAnchorSlug(children[0])}>{children}</h2>,
    },
  };

  return (
    <>
      <SEO
        title={contentfulPage.title}
        description={contentfulPage.description || description}
        siteName={siteName}
        baseUrl={baseUrl}
        adSense={adSense}
        image={sitePage.fields.image}
      />
      <ContentWrapper>
        <PageHeader title={contentfulPage.title} description={contentfulPage.description} />
        <PageContent
          title={contentfulPage.title}
          pathname={pathname}
          pages={pages}
          hash={hash}
          headings={headings}
        >
          {contentfulPage.isHomepage && <MenuItems home style={{ marginBottom: 20 }} />}
          {contentfulPage.image && (
            <Img
              fluid={contentfulPage.image.fluid}
              style={{
                height: 'auto',
                maxHeight: '400px',
                width: '90%',
                margin: '26px 0',
              }}
              imgStyle={{
                objectFit: 'cover',
                borderRadius: 10,
              }}
            />
          )}
          <Wrapper style={{ whiteSpace: 'break-spaces' }}>
            {documentToReactComponents(contentfulPage.body.json, options)}
          </Wrapper>
        </PageContent>
        <Footer />
      </ContentWrapper>
    </>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export const PageTemplateQuery = graphql`
  query PageTemplateQuery($id: String) {
    sitePage(fields: { id: { eq: $id } }) {
      fields {
        image
      }
    }
    contentfulPage(id: { eq: $id }) {
      isHomepage
      body {
        json
      }
      title
      description
      image {
        fluid(maxHeight: 400, quality: 100) {
          ...GatsbyContentfulFluid
        }
      }
    }
    contentfulGlobalSettings {
      siteName
      description
    }
  }
`;
