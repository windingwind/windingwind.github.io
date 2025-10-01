const PUBLICATIONS = [
  {
    title: "NeuralPVS: Learned Estimation of Potentially Visible Sets",
    authors: "Xiangyu Wang, Thomas Köhler, Jun Lin Qiu, Shohei Mori, Markus Steinberger, Dieter Schmalstieg",
    image: "neuralpvs/static/images/representative-tiny.png",
    conference: "ACM SIGGRAPH Asia 2025",
    links: {
      "project page": "neuralpvs/index.html",
      arxiv: "https://arxiv.org/abs/2509.24677",
      pdf: "https://arxiv.org/pdf/2509.24677",
      code: "",
      video: "neuralpvs/static/videos/supp.mp4",
      supp: "",
    },
    badges: [],
    comments: `Real-time visibility determination in expansive or dynamically changing environments has long posed a significant challenge in computer graphics. Existing techniques are computationally expensive and often applied as a precomputation step on a static scene. We present NeuralPVS, the first deep-learning approach for visibility computation that efficiently determines from-region visibility in a large scene, running at approximately 100 Hz processing with less than 1% missing geometry. This approach is possible by using a neural network operating on a voxelized representation of the scene. The network's performance is achieved by combining sparse convolution with a 3D volume-preserving interleaving for data compression. Moreover, we introduce a novel repulsive visibility loss that can effectively guide the network to converge to the correct data distribution. This loss provides enhanced robustness and generalization to unseen scenes. Our results demonstrate that NeuralPVS outperforms existing methods in terms of both accuracy and efficiency, making it a promising solution for real-time visibility computation.\nComments: SIGGRAPH Asia 2025\nSubjects: Graphics (cs.GR)\nACM classes: I.3.7\nCite as: arXiv:2509.24677 [cs.GR] (or arXiv:2509.24677v1 [cs.GR] for this version)`
  },
  {
    title:
      "Seal-3D: Interactive Pixel-Level Editing for Neural Radiance Fields",
    authors:
      "Xiangyu Wang, Jingsen Zhu, Qi Ye, Yuchi Huo, Yunlong Ran, Zhihua Zhong, Jiming Chen",
    image: "https://github.com/windingwind/windingwind.github.io/assets/33902321/084befa0-93f0-47a4-a0da-e310f035119a",
    conference: "ICCV 2023",
    links: {
      "project page": "seal-3d/index.html",
      paper: "https://openaccess.thecvf.com/content/ICCV2023/html/Wang_Seal-3D_Interactive_Pixel-Level_Editing_for_Neural_Radiance_Fields_ICCV_2023_paper.html",
      arxiv: "https://arxiv.org/abs/2307.15131",
      pdf: "https://arxiv.org/pdf/2307.15131",
      video: "seal-3d/static/videos/supp.mp4",
      code: "https://github.com/windingwind/seal-3d/",
    },
    badges: [],
  },
  {
    title:
      "AdaptiveFusion: Adaptive Multi-Modal Multi-View Fusion for 3D Human Body Reconstruction",
    authors:
      "Anjun Chen, Xiangyu Wang, Zhi Xu, Kun Shi, Yan Qin, Yuchi Huo",
    // image: "https://chen3110.github.io/ImmFusion/resources/framework.png",
    conference: "IEEE Transactions on Multimedia 2025",
    links: {
      "project page": "",
      paper: "https://doi.org/10.1109/TMM.2025.3613111",
      arxiv: "https://arxiv.org/abs/2409.04851",
      pdf: "",
      supp: "",
      video: "",
      code: "",
    },
    badges: [],
  },
  {
    title:
      "Towards weather-robust 3D human body reconstruction: Millimeter-wave radar-based dataset, benchmark, and multi-modal fusion",
    authors:
      "Anjun Chen, Xiangyu Wang, Kun Shi, Yuchi Huo, Jiming Chen, Qi Ye",
    // image: "https://chen3110.github.io/ImmFusion/resources/framework.png",
    conference: "IEEE Transactions on Circuits and Systems for Video Technology 2024",
    links: {
      "project page": "",
      paper: "https://doi.org/10.1109/TCSVT.2024.3461960",
      arxiv: "",
      pdf: "",
      supp: "",
      video: "",
      code: "",
    },
    badges: [],
  },
  {
    title:
      "ImmFusion: Robust mmWave-RGB Fusion for 3D Human Body Reconstruction in All Weather Conditions",
    authors:
      "Anjun Chen, Xiangyu Wang, Kun Shi, Shaohao Zhu, Bin Fang, Yingfeng Chen, Jiming Chen, Yuchi Huo, Qi Ye",
    image: "https://chen3110.github.io/ImmFusion/resources/good_case.png",
    conference: "ICRA 2023",
    links: {
      "project page": "https://chen3110.github.io/ImmFusion/index.html",
      paper: "",
      arxiv: "https://arxiv.org/abs/2210.01346",
      pdf: "https://arxiv.org/pdf/2210.01346",
      supp: "",
      video: "",
      code: "https://github.com/Chen3110/ImmFusion",
    },
    badges: [],
  },
  {
    title:
      "mmBody Benchmark: 3D Body Reconstruction Dataset and Analysis for Millimeter Wave Radar",
    authors:
      "Anjun Chen, Xiangyu Wang, Shaohao Zhu, Yanxu Li, Jiming Chen, Qi Ye",
    image: "https://chen3110.github.io/mmbody/resources/good_case.png",
    conference: "ACM MM 2022",
    links: {
      "project page": "https://chen3110.github.io/mmbody/",
      paper: "https://dl.acm.org/doi/10.1145/3503161.3548262",
      arxiv: "https://arxiv.org/abs/2209.05070",
      pdf: "https://arxiv.org/pdf/2209.05070",
      supp: "",
      video: "",
      code: "",
      data: "https://github.com/Chen3110/mmBody",
    },
    badges: [],
  },
];

const HIGHLIGHT_NAME = "xiangyu wang";

window._PUB_CONFIG = {
  highlightName: HIGHLIGHT_NAME,
  publications: PUBLICATIONS,
};