require 'elasticsearch/model'

class Actor < ActiveRecord::Base

  has_many :actor_movie_character_mappings
  has_many :movies, through: :actor_movie_character_mappings
  has_many :characters, through: :actor_movie_character_mappings

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  def movie_basics
    @actors_basic ||= begin
      sql = "select mo.*, c.name as character_name from actor_movie_character_mappings m join actors a on m.actor_id = a.id join movies mo on m.movie_id = mo.id join characters c on m.character_id = c.id where a.id = " +  self.id.to_s

      connection = ActiveRecord::Base.connection
      sql_value = connection.execute(sql)
      connection.close
      sql_value
    end
  end
end
