import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

interface ISessionResponse {
  session_id: string;
}

export namespace Api {
  export async function requestAPI(
    url = '',
    init: RequestInit = {}
  ): Promise<Response> {
    // Make request to Jupyter API
    const settings = ServerConnection.makeSettings();

    let response: Response;
    try {
      response = await ServerConnection.makeRequest(url, init, settings);
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
    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(settings.baseUrl, 'v1', 'gateway');
    const requestInit: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        url: 'v1/sessions',
        data: {
          planner: 'blink',
          execution_type: 'streaming'
        }
      })
    };
    const response = await requestAPI(requestUrl, requestInit);
    const data = await response.json();
    return data;
  }

  export async function postSQL(statement: string): Promise<ISessionResponse> {
    const sessionID = sessionStorage.getItem('session_id');
    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(settings.baseUrl, 'v1', 'gateway');
    const requestInit: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        url: `/v1/sessions/${sessionID}/statements`,
        data: { statement }
      })
    };
    const response = await requestAPI(requestUrl, requestInit);
    const data = await response.json();
    return data;
  }
}
