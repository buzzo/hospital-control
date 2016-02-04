FROM bitnami/apache:latest
ADD application.tar /app
ADD vhost-service.conf /opt/bitnami/apache2/conf/vhosts/
ADD httpd.conf /opt/bitnami/apache2/conf/
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["httpd"]
