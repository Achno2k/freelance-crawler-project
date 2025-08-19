from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CrawlResult
from schemas import CrawlResult

def is_downloadable_file(link: str) -> bool:
    """
    Checks if the link is a downloadable file based on known patterns.
    """
    if not isinstance(link, str):
        return False
    return ("frmPDF.aspx" in link)
    

async def crawl_website(url: str) -> CrawlResult:
    """
    Crawl the website and return:
        - markdown content
        - list of downloadable file links
        - original page URL
    """
    browser_config = BrowserConfig(headless=True)
    run_config = CrawlerRunConfig(
        remove_overlay_elements=True,
        word_count_threshold=10,
        exclude_external_links=False,
    )
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result: CrawlResult = await crawler.arun(
            url=url, 
            config=run_config
        )
    all_links = result.links['internal'] or []
    # pprint.pprint(all_links)

    file_links = []
    for link in all_links:
        if is_downloadable_file(link['href']):
            file_links.append(link['href'])

    return CrawlResult (
                markdown=result.markdown,
                pdf_urls=list(set(file_links)),
                url=url
            )