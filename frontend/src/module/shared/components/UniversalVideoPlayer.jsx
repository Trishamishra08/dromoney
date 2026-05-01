import { BASE_URL } from '../services/api';
const UniversalVideoPlayer = ({ url, className, onEnded, autoPlay = true, controls = true }) => {
    if (!url) return null;

    // Fix relative URLs from server
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

    // Helper to extract YouTube ID
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Helper to extract Vimeo ID
    const getVimeoId = (url) => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
    };

    const youtubeId = getYouTubeId(url);
    const vimeoId = getVimeoId(url);

    if (youtubeId) {
        return (
            <div className={`relative pb-[56.25%] h-0 ${className}`}>
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&controls=${controls ? 1 : 0}`}
                    className="absolute top-0 left-0 w-full h-full rounded-none"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                ></iframe>
            </div>
        );
    }

    if (vimeoId) {
        return (
            <div className={`relative pb-[56.25%] h-0 ${className}`}>
                <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlay ? 1 : 0}`}
                    className="absolute top-0 left-0 w-full h-full rounded-none"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Vimeo video player"
                ></iframe>
            </div>
        );
    }

    // Default to HTML5 Video for direct links (.mp4, etc.)
    return (
        <video
            src={fullUrl}
            className={className}
            controls={controls}
            autoPlay={autoPlay}
            playsInline
            onEnded={onEnded}
            style={{ width: '100%', borderRadius: '0' }}
        />
    );
};

export default UniversalVideoPlayer;
