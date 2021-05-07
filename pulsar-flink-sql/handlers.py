import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
import requests


class GateWayHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        auth = self.request.headers['PulsarCloudAuth']
        input_data = self.get_json_body()

        url = input_data['url']
        method = input_data.get('method', 'POST')
        data = input_data.get('data', {})

        cluster_url = os.getenv('X_API_FLINK_CLUSTER')
        request_url = cluster_url + url
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth,
        }
        if method == 'POST':
            r = requests.post(request_url, data=json.dumps(data), headers=headers)
        elif method == 'DELETE':
            r = requests.delete(request_url, headers=headers)
        else:
            r = requests.get(request_url, headers=headers)

        self.finish(r.text)


def setup_handlers(web_app, url_path):
    host_pattern = '.*$'
    base_url = web_app.settings['base_url']

    # Post request to Flink gateway
    route_pattern = url_path_join(base_url, url_path, 'gateway')
    handlers = [(route_pattern, GateWayHandler)]
    web_app.add_handlers(host_pattern, handlers)
