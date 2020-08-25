import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import rehypeReact from 'rehype-react';
import styled from '@emotion/styled';
import {colors} from '../utils/colors';
import {smallCaps} from '../utils/typography';
import {MDXProvider} from '@mdx-js/react';
import {graphql, navigate} from 'gatsby';
import SEO from "./seo";
import ContentWrapper from './content-wrapper';
import PageHeader from "./page-header";
import Footer from './footer';
import PageContent from "./page-content";
import {VideoBox} from "./videoBox";

const CustomLinkContext = createContext();

function CustomLink(props) {
  const {pathPrefix, baseUrl} = useContext(CustomLinkContext);

  const linkProps = {...props};
  if (props.href) {
    if (props.href.startsWith('/')) {
      linkProps.onClick = function handleClick(event) {
        const href = event.target.getAttribute('href');
        if (href.startsWith('/')) {
          event.preventDefault();
          navigate(href.replace(pathPrefix, ''));
        }
      };
    } else if (!props.href.startsWith('#') && !props.href.startsWith(baseUrl)) {
      linkProps.target = '_blank';
      linkProps.rel = 'noopener noreferrer';
    }
  }

  return <a {...linkProps} />;
}

CustomLink.propTypes = {
  href: PropTypes.string
};

const TableWrapper = styled.div({
  overflow: 'auto',
  marginBottom: '1.45rem'
});

const tableBorder = `1px solid ${colors.divider}`;
const StyledTable = styled.table({
  border: tableBorder,
  borderSpacing: 0,
  borderRadius: 4,
  [['th', 'td']]: {
    padding: 16,
    borderBottom: tableBorder
  },
  'tbody tr:last-child td': {
    border: 0
  },
  th: {
    ...smallCaps,
    fontSize: 13,
    fontWeight: 'normal',
    color: colors.text2,
    textAlign: 'inherit'
  },
  td: {
    verticalAlign: 'top',
    p: {
      fontSize: 'inherit',
      lineHeight: 'inherit'
    },
    code: {
      whiteSpace: 'normal'
    }
  }
});

function CustomTable(props) {
  return (
    <TableWrapper>
      <StyledTable {...props} />
    </TableWrapper>
  );
}

function createCustomHeading(tag) {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({children, ...props}) =>
    React.createElement(
      tag,
      props,
      // eslint-disable-next-line react/prop-types
      <a className="headingLink" href={'#' + props.id}>
        {Array.isArray(children)
          ? // eslint-disable-next-line react/prop-types
          children.filter(
            child => child.type !== CustomLink && child.props?.mdxType !== 'a'
          )
          : children}
      </a>
    );
}

const components = {
  a: CustomLink,
  table: CustomTable,
  h1: createCustomHeading('h1'),
  h2: createCustomHeading('h2'),
  h3: createCustomHeading('h3'),
  h4: createCustomHeading('h4'),
  h5: createCustomHeading('h5'),
  h6: createCustomHeading('h6')
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components
}).Compiler;

export default function Template(props) {
  const {hash, pathname} = props.location;
  const {file, site} = props.data;
  const {frontmatter, headings, fields} =
  file.childMarkdownRemark || file.childMdx;
  const {title, description} = site.siteMetadata;
  const {
    sidebarContents,
    githubUrl,
    twitterHandle,
    adSense,
    baseUrl
  } = props.pageContext;

  const pages = sidebarContents
    .reduce((acc, {pages}) => acc.concat(pages), [])
    .filter(page => !page.anchor);

  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || description}
        siteName={title}
        baseUrl={baseUrl}
        image={fields.image}
        twitterHandle={twitterHandle}
        adSense={adSense}
      />
      <ContentWrapper>
        <PageHeader {...frontmatter} />
        <hr />
        {frontmatter.ytLink &&
          <>
            <VideoBox videoUrl={frontmatter.ytLink} />
            <hr />
          </>
        }
        <PageContent
          title={frontmatter.title}
          graphManagerUrl={fields.graphManagerUrl}
          pathname={pathname}
          pages={pages}
          headings={headings}
          hash={hash}
          githubUrl={githubUrl}
        >
          <CustomLinkContext.Provider
            value={{
              pathPrefix: site.pathPrefix,
              baseUrl
            }}
          >
            {file.childMdx ? (
              <MDXProvider components={components}>
                <MDXRenderer>{file.childMdx.body}</MDXRenderer>
              </MDXProvider>
            ) : (
              renderAst(file.childMarkdownRemark.htmlAst)
            )}
          </CustomLinkContext.Provider>
        </PageContent>
        <Footer />
      </ContentWrapper>
    </>
  );
}

Template.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query PageQuery($id: String) {
    site {
      pathPrefix
      siteMetadata {
        title
        description
      }
    }
    file(id: {eq: $id}) {
      childMarkdownRemark {
        frontmatter {
          title
          description
        }
        headings(depth: h2) {
          value
        }
        fields {
          image
          graphManagerUrl
        }
        htmlAst
      }
      childMdx {
        frontmatter {
          title
          description
          ytLink
        }
        headings(depth: h2) {
          value
        }
        fields {
          image
          graphManagerUrl
        }
        body
      }
    }
  }
`;
