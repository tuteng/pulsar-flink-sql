import os
import json

# from notebook.base.handlers import APIHandler
from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado


class SessionHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        data = {"session_id": "918e6d1eff0c14228069edec25144022"}
        self.finish(json.dumps(data))


class SQLHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        data = {"session_id": input_data['session_id'], "statement": input_data["statement"]}
        self.finish(json.dumps(data))


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Get Flink gateway session ID
    route_pattern = url_path_join(base_url, url_path, "sessions")
    handlers = [(route_pattern, SessionHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Post SQL
    route_pattern = url_path_join(base_url, url_path, "statements")
    handlers = [(route_pattern, SQLHandler)]
    web_app.add_handlers(host_pattern, handlers)
