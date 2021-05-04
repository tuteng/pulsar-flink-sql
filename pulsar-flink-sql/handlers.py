import os
import json

# from notebook.base.handlers import APIHandler
from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
import requests


class GateWayHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        url = input_data["url"]
        data = input_data["data"]
        headers = {'Content-Type': 'application/json'}
        r = requests.post('http://127.0.0.1:5000/' + url, data=json.dumps(data), headers=headers)
        self.finish(r.text)


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Post request to Flink gateway
    route_pattern = url_path_join(base_url, url_path, "gateway")
    handlers = [(route_pattern, GateWayHandler)]
    web_app.add_handlers(host_pattern, handlers)
