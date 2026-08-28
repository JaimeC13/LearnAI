export interface GenerateQuestionResponse {
  filename: string;
  generated_question: string;
  extracted_text_preview: string;
  device: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function uploadPdfAndGenerateQuestion(file: File): Promise<GenerateQuestionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/generate-question`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error al procesar el documento con el modelo de IA");
  }

  return await response.json();
}