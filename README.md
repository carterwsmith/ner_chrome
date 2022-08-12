# NER Chrome Extension
A simple Google Chrome extension that highlights named entities.
Model used: [LUKE (HuggingFace)](https://huggingface.co/docs/transformers/model_doc/luke)

### How to use:
- Enable developer mode at `chrome://extensions`
- Choose 'load unpacked' and select the `extension` directory
- Run the Django server with `python3 manage.py runserver`
- Access the root index of the server to load the model
- Enable the extension and select 'Highlight' on a page