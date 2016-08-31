FROM backend/base:latest
MAINTAINER Scott Newcomer

# Copy application artifacts
COPY target /wheelhouse

# Install application
RUN . /appenv/bin/activate && \
    pip install --no-index -f /wheelhouse backend && \
    rm -rf /wheelhouse
