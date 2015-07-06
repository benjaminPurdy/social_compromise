module CompromiseHelper
  def delete_old_votes(compromise)
    #newest_n_records = CompromiseUserMovieVoteMapping.where(user_id: current_user.id, compromise_id: compromise.id, :order => 'created_at DESC', :limit => 100)
    #CompromiseUserMovieVoteMapping.destroy_all(['id NOT IN (?)', newest_n_records.collect(&:id)])
  end

  def mark_as_displaying(suggested_movies, compromise_id)
    suggested_movies.each do |suggested_movie|
      CompromiseUserMovieVoteMapping.find_or_create_by(user_id: current_user.id, movie_id: suggested_movie.id, compromise_id: compromise_id, displaying?: true, displayed?: true)
    end
  end

  def users_in_compromise(compromise)
    participants = []
    @participants ||= begin
      map = CompromiseUserMapping.where(compromise_id: compromise.id)
      map.each do |mapping|
        user = User.find(mapping.user_id)
        participants.push user
      end
      participants
    end
  end

  def owner(compromise)
    @owner ||= begin
      compromise_user_mapping = CompromiseUserMapping.where(compromise_id: compromise.id)
      compromise_user_mapping.each do |map|
        if map.owner? == true
          return User.find(map.user_id)
        end
      end
    end
  end

  def displaying_movies(compromise)
    displaying_movies = []
    movies_map = CompromiseUserMovieVoteMapping.where(user_id: current_user.id, compromise_id: compromise.id, displaying?: true)
    movies_map.each do |movie_map|
      displaying_movies.push(Movie.find(movie_map.movie_id))
    end
    displaying_movies
  end

  def displayed_movies(compromise)
    displayed_movies = []
    movies_map = CompromiseUserMovieVoteMapping.where(user_id: current_user.id, compromise_id: compromise.id, displayed?: true)
    movies_map.each do |movie_map|
      displayed_movies.push(Movie.find(movie_map.movie_id))
    end
    displayed_movies
  end


  def mark_as_displayed(compromise_id, movie_id)
    mapping = CompromiseUserMovieVoteMapping.find_by(user_id: current_user.id, movie_id: movie_id, compromise_id: compromise_id)
    mapping.update(displaying?: false, displayed?: true)
  end

  def record_new_vote(movie_id, compromise_id, vote)
    previous_recored = CompromiseUserMovieVoteMapping.find_by(user_id: current_user.id, movie_id: movie_id, compromise_id: compromise_id)
    previous_recored.update_attributes(displayed?: true, displaying?: false, vote: vote)
    previous_recored.save!
    if params["vote"] == "yay"
      current_user.like(Movie.find(movie_id))
    else
      current_user.dislike(Movie.find(movie_id))
    end
  end
end
