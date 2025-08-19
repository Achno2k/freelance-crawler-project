from urllib.parse import urlparse, urljoin
from core.llm.prompt_engine import generate_output_from_llm
from core.crawler.crawl_engine import crawl_website
from core.extarctors.pdf_extractor import extract_text_from_pdf_url
from schemas import LLMResponse, CrawlResult, WebsitePromptConfig
from typing import List, Optional, Union
from logger import logger


#  Defining the response type datatype to ensure type safety 
# pdf --> LLMResponse --> for every single website a single response
# markdown --> List[LLMResponse] --> for a single website which can have multiple projects embedded
ResponseType = Union[LLMResponse, List[LLMResponse], None]

async def process_website(url: str, site_config: WebsitePromptConfig) -> List[LLMResponse]:
    """
    Crawl → Extract → Prompt → Return LLMResponse or List[LLMResponse]
    """
    content_info_type: str = site_config.get_content_type() 
    crawl_result: Optional[CrawlResult] = await crawl_website(url)
    domain = urlparse(url).netloc
    results: List[LLMResponse] = []

    if content_info_type == 'pdf':
        all_pdf_urls = []
        if crawl_result and crawl_result.pdf_urls is not None:
            all_pdf_urls = [urljoin(crawl_result.url, link) for link in crawl_result.pdf_urls]
        
        logger.info(f"Found {len(all_pdf_urls)} PDFs from web")

        for idx, pdf_url in enumerate(all_pdf_urls):
            logger.info(f"Extracting the pdf text from {idx+1} pdf")
            pdf_text = extract_text_from_pdf_url(pdf_url=pdf_url)
            logger.info(f"Getting the llm response from the {idx+1} pdf")
            # Extracting the LLMResponse for a single pdf
            llm_response: ResponseType = generate_output_from_llm(domain, pdf_text, site_config, pdf_url)
            if llm_response is not None and type(llm_response) == LLMResponse:
                logger.info(f"Successfully appended {idx+1} response(s) to the results")
                results.append(llm_response)
                # pprint.pprint(results[-1])

    else:
        logger.info("No downloadable PDFs found. Using page markdown to extract the data.")
        content_markdown = crawl_result.markdown
        llm_responses: ResponseType = generate_output_from_llm(domain, content_markdown, site_config, "")
        # Extracting the response in type of List[LLMResponse]
        if llm_responses and type(llm_responses) == List[LLMResponse]:
            logger.info(f"Successfully appended HTML-based response(s) to the results")
            results.extend(llm_responses)
    
    if not results:
        raise RuntimeError(f"Failed to extract data from {url} using LLM.")
    
    return results
