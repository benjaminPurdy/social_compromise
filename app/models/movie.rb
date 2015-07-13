require 'elasticsearch/model'

class Movie < ActiveRecord::Base

  has_many :actor_movie_character_mappings
  has_many :genre_movie_mappings
  has_many :actors, through: :actor_movie_character_mappings
  has_many :characters, through: :actor_movie_character_mappings
  has_many :genres, through: :genre_movie_mappings

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  def actors_basic
    @actors_basic ||= begin
      sql = "select a.id, a.name as actor_name,a.profile_path, c.name as character_name from actor_movie_character_mappings m join actors a on m.actor_id = a.id join movies mo on m.movie_id = mo.id join characters c on m.character_id = c.id where mo.id = " + self.id.to_s

      connection = ActiveRecord::Base.connection
      sql_value = connection.execute(sql)
      connection.close
      sql_value
    end
  end

  def similar_movies
    @similar_movies ||= begin
      sql = 'select mo.* from similar_movie_mappings s join movies mo on s.similar_movie_id = mo.id where movie_id = ' + self.id.to_s

      connection = ActiveRecord::Base.connection
      sql_value = connection.execute(sql)
      connection.close
      sql_value
    end
  end
end
