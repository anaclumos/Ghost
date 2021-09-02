const postEmailSerializer = require('./post-email-serializer');

class EmailPreview {
    /**
     * @constructor
     * @param {Object} options
     * @param {String} options.apiVersion
     * @param {Function} [options.isSet]
     */
    constructor({apiVersion, isSet}) {
        this.apiVersion = apiVersion;
        this.isSet = isSet;
    }

    /**
     * @param {Object} post - Post model object instance
     * @param {String} memberSegment - member segment filter
     * @returns {Promise<Object>}
     */
    async generateEmailContent(post, memberSegment) {
        let emailContent = await postEmailSerializer.serialize(post, {
            isBrowserPreview: true,
            apiVersion: this.apiVersion
        });

        if (this.isSet && this.isSet('emailCardSegments') && memberSegment) {
            emailContent = postEmailSerializer.renderEmailForSegment(emailContent, memberSegment);
        }

        const replacements = postEmailSerializer.parseReplacements(emailContent);

        replacements.forEach((replacement) => {
            emailContent[replacement.format] = emailContent[replacement.format].replace(
                replacement.match,
                replacement.fallback || ''
            );
        });

        return emailContent;
    }
}

module.exports = EmailPreview;
