export interface Consent {
    id: string;
    patientId: string;
    patientName: string;
    procedureName: string;
    consentText: string;
    signatureDataUrl: string; // A imagem da assinatura
    createdAt: string;
}
