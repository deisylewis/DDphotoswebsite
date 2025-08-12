// Performance Monitoring Script for D&D Photos
// Tracks Core Web Vitals and SEO-critical metrics

(function() {
    'use strict';

    // Performance monitoring configuration
    const config = {
        siteName: 'D&D Photos',
        siteUrl: 'https://dndphotos.com',
        trackingEndpoint: null, // Can be set to your analytics endpoint
        debug: false
    };

    // Performance metrics storage
    let metrics = {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        ttfb: null,
        domLoad: null,
        windowLoad: null
    };

    // Debug logging
    function log(message, data = null) {
        if (config.debug) {
            console.log(`[Performance Monitor] ${message}`, data);
        }
    }

    // Send metrics to analytics (if configured)
    function sendMetrics(metricName, value) {
        if (config.trackingEndpoint) {
            fetch(config.trackingEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    site: config.siteName,
                    metric: metricName,
                    value: value,
                    timestamp: Date.now(),
                    url: window.location.href
                })
            }).catch(err => log('Failed to send metrics', err));
        }

        // Also send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', metricName, { value: value });
        }
    }

    // Core Web Vitals monitoring
    function initCoreWebVitals() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    switch (entry.entryType) {
                        case 'largest-contentful-paint':
                            metrics.lcp = entry.startTime;
                            log('LCP recorded', metrics.lcp);
                            sendMetrics('LCP', Math.round(metrics.lcp));
                            break;
                        case 'first-input':
                            metrics.fid = entry.processingStart - entry.startTime;
                            log('FID recorded', metrics.fid);
                            sendMetrics('FID', Math.round(metrics.fid));
                            break;
                        case 'layout-shift':
                            metrics.cls = entry.value;
                            log('CLS recorded', metrics.cls);
                            sendMetrics('CLS', metrics.cls);
                            break;
                        case 'first-contentful-paint':
                            metrics.fcp = entry.startTime;
                            log('FCP recorded', metrics.fcp);
                            sendMetrics('FCP', Math.round(metrics.fcp));
                            break;
                    }
                }
            });

            observer.observe({ 
                entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'first-contentful-paint'] 
            });
        }
    }

    // Time to First Byte monitoring
    function monitorTTFB() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            metrics.ttfb = navigation.responseStart - navigation.requestStart;
            log('TTFB recorded', metrics.ttfb);
            sendMetrics('TTFB', Math.round(metrics.ttfb));
        }
    }

    // DOM and Window load monitoring
    function monitorLoadTimes() {
        document.addEventListener('DOMContentLoaded', () => {
            metrics.domLoad = performance.now();
            log('DOM Load recorded', metrics.domLoad);
            sendMetrics('DOM_LOAD', Math.round(metrics.domLoad));
        });

        window.addEventListener('load', () => {
            metrics.windowLoad = performance.now();
            log('Window Load recorded', metrics.windowLoad);
            sendMetrics('WINDOW_LOAD', Math.round(metrics.windowLoad));
        });
    }

    // SEO-critical resource monitoring
    function monitorCriticalResources() {
        const criticalResources = [
            'optimized-images/hero-image.jpg',
            'styles/logo.css',
            'favicon.ico'
        ];

        criticalResources.forEach(resource => {
            const img = new Image();
            img.onload = () => {
                log(`Critical resource loaded: ${resource}`);
                sendMetrics('CRITICAL_RESOURCE_LOAD', resource);
            };
            img.onerror = () => {
                log(`Critical resource failed: ${resource}`);
                sendMetrics('CRITICAL_RESOURCE_ERROR', resource);
            };
            img.src = resource;
        });
    }

    // Error monitoring
    function monitorErrors() {
        window.addEventListener('error', (event) => {
            log('JavaScript error detected', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno
            });
            sendMetrics('JS_ERROR', event.message);
        });

        window.addEventListener('unhandledrejection', (event) => {
            log('Unhandled promise rejection', event.reason);
            sendMetrics('PROMISE_REJECTION', event.reason);
        });
    }

    // SEO health checks
    function performSEOHealthChecks() {
        const checks = {
            title: document.title.length > 10 && document.title.length < 60,
            description: document.querySelector('meta[name="description"]')?.content.length > 50,
            canonical: !!document.querySelector('link[rel="canonical"]'),
            robots: !!document.querySelector('meta[name="robots"]'),
            viewport: !!document.querySelector('meta[name="viewport"]'),
            structuredData: !!document.querySelector('script[type="application/ld+json"]'),
            images: document.querySelectorAll('img[alt]').length === document.querySelectorAll('img').length
        };

        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                log(`SEO check failed: ${check}`);
                sendMetrics('SEO_CHECK_FAILED', check);
            }
        });

        return checks;
    }

    // Performance score calculation
    function calculatePerformanceScore() {
        let score = 100;
        
        if (metrics.lcp > 2500) score -= 20;
        if (metrics.fid > 100) score -= 20;
        if (metrics.cls > 0.1) score -= 20;
        if (metrics.ttfb > 600) score -= 20;
        
        log('Performance score calculated', score);
        sendMetrics('PERFORMANCE_SCORE', score);
        
        return Math.max(0, score);
    }

    // Initialize monitoring
    function init() {
        log('Performance monitoring initialized');
        
        initCoreWebVitals();
        monitorTTFB();
        monitorLoadTimes();
        monitorCriticalResources();
        monitorErrors();
        
        // Run SEO checks after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', performSEOHealthChecks);
        } else {
            performSEOHealthChecks();
        }
        
        // Calculate final performance score after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                calculatePerformanceScore();
            }, 1000);
        });
    }

    // Start monitoring
    init();

    // Expose metrics for debugging
    window.performanceMetrics = metrics;
    window.performanceScore = calculatePerformanceScore;

})();


