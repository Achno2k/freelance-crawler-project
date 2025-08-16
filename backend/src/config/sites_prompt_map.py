from schemas import WebsitePromptConfig
from typing import Dict

site_prompt_map: Dict[str, WebsitePromptConfig] = {
    "https://shasanadesh.up.gov.in": WebsitePromptConfig(
        url="https://shasanadesh.up.gov.in",
        content_type="pdf",
        prompt="You are given text extracted from a government tender document which contains information about construction projects, which needs to be extracted in the form of the following JSON." \
        "Now the document or the text can also be some other document related to some government schemes or something, not necessarily a construction project. I want you to " \
        "ignore these type of documents and only extract information from the construction projects document in the following format below."
        "Extract the following fields in JSON:\n\n- project_name: Name of the construction project (in English if possible, otherwise Hindi)\n- " \
        "department: Government department or ministry issuing the tender\n- " \
        "location: Project location, city, state\n- " \
        "budget: Project budget amount (extract only the number, no currency symbols)\n- " \
        "deadline: Last date for tender submission (format as YYYY-MM-DD if possible)\n- " \
        "contact_info: Contact person, office, phone number, email\n- " \
        "requirements: Key technical requirements, specifications, or conditions\n- " \
        "work_description: Brief description of the work to be done\n\n" \
        "Return the extracted information as a JSON object with exactly these keys. If any field is missing, use null."\
        "Also I want you to make sure that the document is a construction project, not anything else." \
        "If the document is not actually a valid contruction project or is something else entirely. I want you to simply return the following string and nothing else." \
        "`Not a government construction order`"
    ),

    # "https://www.example.com/": WebsitePromptConfig(
    #     url="https://www.example.com/",
    #     content_type="text",
    #     prompt="You are given markdown from a government website that contains construction project information." \
    #     "I want you to extract all the data in the class \"info-class\" and then return a list of the following JSON for each project that you can extract."
    #     "Extract the following fields in JSON:\n\n- project_name: Name of the construction project (in English if possible, otherwise Hindi)\n- " \
    #     "department: Government department or ministry issuing the tender\n- " \
    #     "location: Project location, city, state\n- " \
    #     "budget: Project budget amount (extract only the number, no currency symbols)\n- " \
    #     "deadline: Last date for tender submission (format as YYYY-MM-DD if possible)\n- " \
    #     "contact_info: Contact person, office, phone number, email\n- " \
    #     "requirements: Key technical requirements, specifications, or conditions\n- " \
    #     "work_description: Brief description of the work to be done\n\n" \
    #     "Return the extracted information as a JSON object with exactly these keys. If any field is missing, use null."\
    #     "Also I want you to make sure that the document is a construction project, not anything else." \
    #     "If the document is not actually a valid contruction project. I want you to simply return the following string and nothing else." \
    #     "`Not a government construction order`"
    # ),
}