interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-surface dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          title="关闭"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            赞助支持
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            如果这个项目对您有帮助，欢迎请我喝杯咖啡 ☕
          </p>
        </div>

        {/* QR Codes */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Alipay */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg mb-2 border border-gray-200">
              <img
                src="/alipay-qr.png"
                alt="支付宝收款码"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.91 11.733a8.5 8.5 0 0 0-2.787-.742c.029-.203.201-1.735.201-1.735l.112-.112L16.436 9l-1.852-.143c-.029-.86-.115-1.735-.201-2.554a.858.858 0 0 0-.889-.716.858.858 0 0 0-.802.889c.029.716.115 1.506.143 2.324h-2.41c.115-.66.23-1.334.316-1.994a.858.858 0 0 0-.802-.889.858.858 0 0 0-.889.716c-.086.746-.201 1.506-.316 2.267-.63 0-1.247.029-1.85.143A.858.858 0 0 0 7 9.573a.858.858 0 0 0 .802.889c.402-.086.818-.115 1.22-.143.172 1.047.344 2.094.602 3.098-1.62.43-3.125 1.105-4.285 2.037A.858.858 0 0 0 5.054 16c.516.373 1.19.573 1.85.573.373 0 .746-.086 1.076-.23.66-.316 1.391-.544 2.123-.63a7.43 7.43 0 0 0 1.477 1.65c-1.334.66-2.239 1.535-2.239 2.51 0 1.65 3.182 2.94 7.046 2.94 3.865 0 7.047-1.29 7.047-2.94 0-1.047-1.133-1.966-2.84-2.555a8.5 8.5 0 0 0 1.65-5.012 8.5 8.5 0 0 0-3.354-6.573zM8.5 14c-.516.172-1.047.23-1.535.23-.23 0-.459-.029-.66-.086.917-.63 2.01-1.19 3.24-1.535a14.43 14.43 0 0 1-.344 1.22c-.23.029-.459.114-.688.172zm4.487 7.96c-3.125 0-5.645-.889-5.645-2.065 0-.545.689-1.076 1.822-1.506a9.92 9.92 0 0 0 3.823.774c1.391 0 2.697-.287 3.865-.774.573.344.889.66.889.975 0 1.19-2.496 2.095-5.63 2.095zm4.43-6.2a6.86 6.86 0 0 1-4.43 1.65 6.72 6.72 0 0 1-3.01-.716 29.08 29.08 0 0 1-.803-2.267h3.125c.46 0 .832-.373.832-.832a.84.84 0 0 0-.832-.832H11.54a20.43 20.43 0 0 1-.287-2.41h4.43a.84.84 0 0 0 .832-.832.84.84 0 0 0-.832-.832h-4.2c-.029-.258-.029-.516-.058-.774h4.2a.84.84 0 0 0 .832-.832.84.84 0 0 0-.832-.832h-3.98c.258-.573.63-1.076 1.076-1.506a7.43 7.43 0 0 1 4.717-1.65c4.028 0 7.303 3.24 7.303 7.245a7.5 7.5 0 0 1-1.363 4.2z" />
              </svg>
              支付宝
            </div>
          </div>

          {/* WeChat Pay */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg mb-2 border border-gray-200">
              <img
                src="/wechat-qr.png"
                alt="微信收款码"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.5 11.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm6.9 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zM23 12.5c0 3.5-3.8 6.3-8.5 6.3-.9 0-1.8-.1-2.6-.3l-2.9 1.4 1-2.5c-2.8-1.3-4.7-3.5-4.7-6 0-3.5 3.8-6.3 8.5-6.3s8.2 2.8 8.2 6.4zM9.3 7.5c-.5-.5-1.3-.6-1.9-.1-1.5 1.2-2.4 3-2.4 4.9 0 1.5.6 2.9 1.6 4l-.4 1.2 1.4-.7c.6.2 1.3.3 2 .3 3.5 0 6.4-2.4 6.4-5.4s-2.9-5.4-6.4-5.4c-1.3 0-2.6.4-3.6 1.1l-.2.1c-.1.1-.3.2-.4.3l-.1.1c-.1.1-.1.1-.2.2l.2.4z" />
              </svg>
              微信支付
            </div>
          </div>
        </div>

        {/* GitHub Sponsors */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-surface dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                或通过国际平台赞助
              </span>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/sponsors/Perlou"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub Sponsors 赞助</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
            💡 请使用支付宝或微信扫描二维码进行赞助
          </p>
        </div>
      </div>
    </div>
  );
}
