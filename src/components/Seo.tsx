import Head from 'next/head'
import { FC } from 'react'

type SeoProps = {
    pageTitle: string
    pageDescription: string
    pagePath?: string
    pageImg: string
    pageImgWidth?: number
    pageImgHeight?: number
}

const SeoHead: FC<SeoProps> = ({
    pageTitle,
    pageDescription,
    pagePath,
    pageImg,
    pageImgWidth = 1200,
    pageImgHeight = 630,
}) => {

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="viewport" content="width=device-width,initial-scale=1.0" />
            <meta name="description" content={pageDescription} />
            <meta property="og:url" content={pagePath} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:site_name" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={pageImg} />
            <meta property="og:image:width" content={String(pageImgWidth)} />
            <meta property="og:image:height" content={String(pageImgHeight)} />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            {/* <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;display=swap"
        rel="stylesheet"
      /> */}
            <link rel="canonical" href={pagePath} />
        </Head>
    )
}

export default SeoHead
