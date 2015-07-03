module CompromiseHelper
  def delete_old_votes(compromise_id)
    newest_n_records = CompromiseUserMovieVoteMapping.find_by(user_id: current_user.id, compromise_id: compromise_id, :order => 'created_at DESC', :limit => 100)
    CompromiseUserMovieVoteMapping.destroy_all(['id NOT IN (?)', newest_n_records.collect(&:id)])
  end

  def mark_as_displaying(suggested_movies, compromise_id)
    suggested_movies.each do |suggested_movie|
      puts "suggested_movies: " + suggested_movie.inspect
      CompromiseUserMovieVoteMapping.find_or_create_by(user_id: current_user.id, movie_id: suggested_movie.id, compromise_id: compromise_id, displaying?: true, displayed?: false)
    end
  end

  def mark_as_displayed(compromise_id, movie_id)
    puts "movie_id: " + movie_id
    mapping = CompromiseUserMovieVoteMapping.find_by(user_id: current_user.id, movie_id: movie_id, compromise_id: compromise_id)
    mapping.update(displaying?: false, displayed?: true)
  end

  def record_new_vote(movie_id, compromise_id, vote)
    CompromiseUserMovieVoteMapping.create(user_id: current_user.id, movie_id: movie_id, compromise_id: compromise_id, vote: vote, displayed?: true, displaying?: false)
    if params["vote"] == "yay"
      current_user.like(Movie.find(movie_id))
    else
      current_user.dislike(Movie.find(movie_id))
    end
  end
end
