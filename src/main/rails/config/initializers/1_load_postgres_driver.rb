# Warbler requires the postgres database connection to be configured using a URL
# This configuration requires the postgres jdbc driver to be included.
# The file name is prefixed by 1_ so it will load first

require 'jdbc/postgres'
Jdbc::Postgres.load_driver