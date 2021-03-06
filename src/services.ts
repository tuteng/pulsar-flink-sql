import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

import { DataGridResponse } from './grid';

interface ISessionResponse {
  session_id: string;
}

interface IErrorResponse {
  kind: 'error';
  errors: Array<string>;
}

export namespace Api {
  export async function requestAPI(init: RequestInit = {}): Promise<Response> {
    const PulsarCloudAuth = sessionStorage.getItem('pulsar_cloud_auth');
    init.method = 'POST';
    init.headers = {
      PulsarCloudAuth
    };

    // Make request to Jupyter API
    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(settings.baseUrl, 'v1', 'gateway');

    let response: Response;
    try {
      response = await ServerConnection.makeRequest(requestUrl, init, settings);
    } catch (error) {
      throw new ServerConnection.NetworkError(error);
    }

    if (!response.ok) {
      const data = await response.json();
      throw new ServerConnection.ResponseError(response, data.message);
    }

    return response;
  }

  export async function getFlinkSession(): Promise<ISessionResponse> {
    const requestInit: RequestInit = {
      body: JSON.stringify({
        url: '/v1/sessions',
        method: 'POST',
        data: {
          planner: 'blink',
          execution_type: 'streaming'
        }
      })
    };
    const response = await requestAPI(requestInit);
    const data = await response.json();
    return data;
  }

  export async function closeFlinkSession(sessionID: string): Promise<void> {
    const requestInit: RequestInit = {
      body: JSON.stringify({
        method: 'DELETE',
        url: `/v1/sessions/${sessionID}`
      })
    };
    await requestAPI(requestInit);
  }

  export async function postSQL(
    statement: string
  ): Promise<DataGridResponse.IDataResponse | IErrorResponse> {
    const sessionID = sessionStorage.getItem('session_id');
    const requestInit: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        method: 'POST',
        url: `/v1/sessions/${sessionID}/statements`,
        data: { statement }
      })
    };
    const response = await requestAPI(requestInit);
    const data = await response.json();
    data.kind = data.errors ? 'error' : 'success';
    return data;
  }

  export async function getDataFromJob(
    job: string,
    token?: number
  ): Promise<DataGridResponse.IJobResponse> {
    const sessionID = sessionStorage.getItem('session_id');

    let url = job;
    if (token !== undefined) {
      url = `/v1/sessions/${sessionID}/jobs/${job}/result/${token}`;
    }

    const requestInit: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        method: 'GET',
        url
      })
    };
    const response = await requestAPI(requestInit);
    const data = await response.json();
    return data;
  }

  export async function closeFlinkJob(
    sessionID: string,
    jobID: string
  ): Promise<void> {
    const requestInit: RequestInit = {
      body: JSON.stringify({
        method: 'DELETE',
        url: `/v1/sessions/${sessionID}/jobs/${jobID}`
      })
    };
    await requestAPI(requestInit);
  }
}
