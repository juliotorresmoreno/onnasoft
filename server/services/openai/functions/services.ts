export type Request = {
  [key: string]: unknown;
};

export abstract class OpenAIService {
  readonly function_name: string = "";
  readonly description: string = "";

  abstract processServiceRequest(request: Request): Promise<string>;
}
