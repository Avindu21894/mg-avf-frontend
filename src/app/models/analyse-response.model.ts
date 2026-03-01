export interface AnalyseResponse {
  job_id: number;
  status: string;
  metadata: {
    filename: string;
    sha256: string;
    timestamp: string;
    duration_sec: number;
    frame_count: number;
    frame_rate: number;
    latency_ms: number;
  };
  summary: {
    authenticity_score: number;
    authenticity_label: string;
    max_fusion_score: number;
    anomaly_segments_count: number;
    fuzzy_summary: {
      mean_real: number;
      mean_borderline: number;
      mean_fake: number;
      borderline_frames: number;
      explanation: string[];
    };
  };
  timeline: {
    threshold: number;
    anomaly_bands: {
      start_frame: number;
      end_frame: number;
      start_time: number;
      end_time: number;
    }[];
  };
  statistics: {
    head: string;
    mean_score: number;
    max_score: number;
    distribution: number[];
  }[];
  heatmaps: {
    phoneme_viseme: number[];
    prosody_facial: number[];
    semantic_expression: number[];
    temporal_sync: number[];
    artifact_residual: number[];
    generative_artifact: number[];
    sinhala_expert: number[];
  };
  top_frames: {
    frame_number: number;
    score: number;
    gradcam_overlay_url: string;
    thumbnail_url: string;
  }[];
  raw_json: {
    anomaly_segments: {
      start_frame: number;
      end_frame: number;
      start_time: number;
      end_time: number;
      max_score: number;
      mean_score: number;
    }[];
  };
}

export type ReportType = 'pdf' | 'html' | 'json';
export type ImageType = 'gradcam' | 'thumbnail'