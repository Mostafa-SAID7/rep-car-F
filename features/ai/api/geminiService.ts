import { GoogleGenAI, Chat, GenerateContentResponse, Type } from '@google/genai';
import {
  ChatSession,
  DiagnosticResult,
  GeoLocation,
  MaintenanceScheduleResult,
  SearchResult,
  SearchSource,
} from '../../../types';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

const getAI = () => {
  if (!API_KEY) {
    throw new Error('Gemini AI is not configured. Add GEMINI_API_KEY to enable AI features.');
  }

  return new GoogleGenAI({ apiKey: API_KEY });
};

const parseJsonResponse = <T>(response: GenerateContentResponse, featureName: string): T => {
  try {
    return JSON.parse(response.text.trim()) as T;
  } catch {
    throw new Error(`${featureName} returned an invalid response. Please try again.`);
  }
};

const getSearchSources = (response: GenerateContentResponse, type: SearchSource['type']): SearchSource[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

  return chunks.flatMap((chunk) => {
    const source = type === 'web' ? chunk.web : chunk.maps;
    return source?.uri && source.title ? [{ title: source.title, uri: source.uri, type }] : [];
  });
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const getDiagnostics = async (problemDescription: string, image?: File): Promise<DiagnosticResult> => {
  const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [
    {
      text: `
        Analyze the following car problem description and the provided image (if any).
        Problem: "${problemDescription}"
        Based on this information, provide a diagnosis. Be as detailed and accurate as possible.
      `,
    },
  ];

  if (image) {
    parts.push(await fileToGenerativePart(image));
  }

  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          possible_causes: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommended_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          severity_level: { type: Type.STRING },
        },
        required: ['possible_causes', 'recommended_actions', 'severity_level'],
      },
    },
  });

  return parseJsonResponse<DiagnosticResult>(response, 'Diagnostics');
};

export const generateMaintenanceSchedule = async (
  make: string,
  model: string,
  year: number,
  mileage: number,
): Promise<MaintenanceScheduleResult> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a maintenance schedule for a ${year} ${make} ${model} with ${mileage} miles.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task_name: { type: Type.STRING },
                interval_miles: { type: Type.NUMBER },
                description: { type: Type.STRING },
              },
              required: ['task_name', 'interval_miles', 'description'],
            },
          },
        },
        required: ['schedule'],
      },
    },
  });

  return parseJsonResponse<MaintenanceScheduleResult>(response, 'Maintenance schedule');
};

export const getDIYGuide = async (topic: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-pro',
    contents: `
      Provide a detailed, step-by-step DIY guide for the following car maintenance task: "${topic}".
      Include a list of necessary tools and safety precautions. Format the response as a single markdown string.
    `,
  });

  return response.text;
};

export const findCarParts = async (query: string): Promise<SearchResult> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Based on the user's query "${query}", find suitable car parts. Provide a summary of the best options and links to where they can be purchased. Use Google Search to find up-to-date information and pricing. Format the response in markdown.`,
    config: { tools: [{ googleSearch: {} }] },
  });

  return { markdown: response.text, sources: getSearchSources(response, 'web') };
};

export const findShops = async (query: string, location: GeoLocation): Promise<SearchResult> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Find nearby car shops based on the user's query: "${query}". Provide a summary of the best options, including their specialties and contact information if available. Format the response in markdown.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: location.latitude, longitude: location.longitude },
        },
      },
    },
  });

  return { markdown: response.text, sources: getSearchSources(response, 'maps') };
};

export const createChatSession = (): ChatSession | null => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: {
      systemInstruction: 'You are a friendly and helpful car maintenance assistant chatbot. Your responses should be concise and formatted in markdown.',
    },
  });

  return {
    sendMessageStream: async function* (message: string) {
      const stream = await chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        if (chunk.text) yield chunk.text;
      }
    },
  };
};